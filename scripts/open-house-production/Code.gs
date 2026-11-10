/**
 * Fuego Open House production.
 * Deploy this only from the Apps Script project
 * "Fuego Open House – Production API".
 * Script properties: OPEN_HOUSE_SECRET, PRODUCTION_SPREADSHEET_ID.
 * The spreadsheet name must be "Fuego Open House – Registrations".
 * The tab name must be "Registrations".
 * The script opens that spreadsheet by ID and writes only to its
 * Registrations tab. Any other workbook is refused.
 * eventId is added by the Next.js server. The browser cannot choose it.
 */
var PRODUCTION_SPREADSHEET_NAME = "Fuego Open House – Registrations";
var PRODUCTION_SHEET_NAME = "Registrations";
var HEADERS = [
  "timestamp",
  "registrationId",
  "name",
  "email",
  "role",
  "referral",
  "courses",
  "message",
  "language",
  "payloadHash",
  "eventId"
];
var COURSE_KEYS = {
  "level-1": true,
  "level-2": true,
  "level-3": true,
  "level-3-technique": true,
  "level-4": true,
  "level-4-technique": true,
  "ramintas-styling": true,
  "role-rotation": true,
  "advanced-foundation": true,
  "footwork": true
};
var ROLE_KEYS = { lead: true, follow: true };
var REFERRAL_KEYS = {
  facebook: true,
  instagram: true,
  google: true,
  friend: true,
  other: true
};
var LANGUAGE_KEYS = { sv: true, en: true };
var UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var HASH_PATTERN = /^[0-9a-f]{64}$/;
var EVENT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function doGet() {
  return jsonResponse({ result: "error" });
}

function doPost(e) {
  var body = readJsonBody(e);
  if (!body) return jsonResponse({ result: "error" });
  if (!secretsMatch(body.secret, scriptProperty("OPEN_HOUSE_SECRET"))) {
    return jsonResponse({ result: "error" });
  }

  var registration = validateRegistration(body);
  if (!registration) return jsonResponse({ result: "error" });

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(8000)) return jsonResponse({ result: "error" });

  try {
    var sheet = openProductionSheet();
    if (!sheet) return jsonResponse({ result: "error" });

    var values = readRows(sheet);
    var existing = findByRegistrationId(values, registration.registrationId, registration.eventId);
    if (existing) {
      if (existing.payloadHash === registration.payloadHash) {
        return jsonResponse({
          result: "success",
          alreadyRegistered: true,
          payloadHash: registration.payloadHash
        });
      }
      return jsonResponse({ result: "error" });
    }

    if (findByEmail(values, registration.email, registration.eventId)) {
      return jsonResponse({
        result: "success",
        alreadyRegistered: true,
        payloadHash: registration.payloadHash
      });
    }

    sheet.appendRow([
      new Date().toISOString(),
      registration.registrationId,
      registration.name,
      registration.email,
      registration.role,
      registration.referral,
      JSON.stringify(registration.courses),
      registration.message,
      registration.language,
      registration.payloadHash,
      registration.eventId
    ]);

    return jsonResponse({
      result: "success",
      alreadyRegistered: false,
      payloadHash: registration.payloadHash
    });
  } catch (error) {
    return jsonResponse({ result: "error" });
  } finally {
    lock.releaseLock();
  }
}

function readJsonBody(e) {
  if (!e || !e.postData || typeof e.postData.contents !== "string") return null;
  try {
    var parsed = JSON.parse(e.postData.contents);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function validateRegistration(body) {
  var name = typeof body.name === "string" ? body.name.trim() : "";
  var email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  var message = typeof body.message === "string" ? body.message.trim() : "";
  var courses = body.courses;
  var payloadHash = typeof body.payloadHash === "string" ? body.payloadHash.toLowerCase() : "";
  var eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";

  if (name.length < 1 || name.length > 120) return null;
  if (email.length > 200 || !EMAIL_PATTERN.test(email)) return null;
  if (!ROLE_KEYS[body.role]) return null;
  if (!REFERRAL_KEYS[body.referral]) return null;
  if (!LANGUAGE_KEYS[body.language]) return null;
  if (typeof body.registrationId !== "string" || !UUID_PATTERN.test(body.registrationId)) return null;
  if (message.length > 2000) return null;
  if (!HASH_PATTERN.test(payloadHash)) return null;
  if (!EVENT_ID_PATTERN.test(eventId) || eventId.length > 64) return null;
  if (!Array.isArray(courses) || courses.length > Object.keys(COURSE_KEYS).length) return null;

  var uniqueCourses = [];
  for (var i = 0; i < courses.length; i++) {
    if (!COURSE_KEYS[courses[i]] || uniqueCourses.indexOf(courses[i]) !== -1) return null;
    uniqueCourses.push(courses[i]);
  }

  var registration = {
    registrationId: body.registrationId,
    name: name,
    email: email,
    role: body.role,
    referral: body.referral,
    courses: uniqueCourses.slice().sort(),
    message: message,
    language: body.language,
    payloadHash: payloadHash,
    eventId: eventId
  };

  if (sha256Hex(canonicalPayload(registration)) !== payloadHash) return null;
  return registration;
}

function canonicalPayload(registration) {
  return JSON.stringify({
    name: registration.name,
    email: registration.email,
    role: registration.role,
    referral: registration.referral,
    courses: registration.courses,
    message: registration.message,
    language: registration.language
  });
}

function openProductionSheet() {
  var spreadsheetId = scriptProperty("PRODUCTION_SPREADSHEET_ID");
  if (!spreadsheetId) return null;

  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  if (spreadsheet.getId() !== spreadsheetId) return null;
  if (spreadsheet.getName() !== PRODUCTION_SPREADSHEET_NAME) return null;

  var sheet = spreadsheet.getSheetByName(PRODUCTION_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(PRODUCTION_SHEET_NAME);
    sheet.appendRow(HEADERS);
    return productionSheetOrNull(sheet, spreadsheetId);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return productionSheetOrNull(sheet, spreadsheetId);
  }

  ensureEventIdHeader(sheet);
  var headerRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  for (var i = 0; i < HEADERS.length; i++) {
    if (headerRow[i] !== HEADERS[i]) return null;
  }
  return productionSheetOrNull(sheet, spreadsheetId);
}

function productionSheetOrNull(sheet, spreadsheetId) {
  if (!sheet || sheet.getName() !== PRODUCTION_SHEET_NAME) return null;
  var parent = sheet.getParent();
  if (parent.getId() !== spreadsheetId) return null;
  if (parent.getName() !== PRODUCTION_SPREADSHEET_NAME) return null;
  return sheet;
}

function ensureEventIdHeader(sheet) {
  var previousHeaders = HEADERS.slice(0, HEADERS.length - 1);
  var headerRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (headerRow[HEADERS.length - 1] === "eventId") return;
  for (var i = 0; i < previousHeaders.length; i++) {
    if (headerRow[i] !== previousHeaders[i]) return;
  }
  if (headerRow[HEADERS.length - 1] !== "") return;
  sheet.getRange(1, HEADERS.length).setValue("eventId");
}

function readRows(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
}

function findByRegistrationId(values, registrationId, eventId) {
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][1]) === registrationId && String(values[i][10]) === eventId) {
      return { payloadHash: String(values[i][9]).toLowerCase() };
    }
  }
  return null;
}

function findByEmail(values, email, eventId) {
  for (var i = 0; i < values.length; i++) {
    if (normalizeEmail(values[i][3]) === email && String(values[i][10]) === eventId) {
      return true;
    }
  }
  return false;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function scriptProperty(key) {
  var value = PropertiesService.getScriptProperties().getProperty(key);
  return typeof value === "string" ? value.trim() : "";
}

function secretsMatch(received, expected) {
  if (!received || !expected || typeof received !== "string") return false;
  var left = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    received,
    Utilities.Charset.UTF_8
  );
  var right = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    expected,
    Utilities.Charset.UTF_8
  );
  if (left.length !== right.length) return false;
  var diff = 0;
  for (var i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

function sha256Hex(text) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    text,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (byte) {
    var value = (byte + 256) % 256;
    return (value < 16 ? "0" : "") + value.toString(16);
  }).join("");
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
