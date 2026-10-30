import assert from "node:assert/strict";
import vm from "node:vm";
import { CONSENT_MODE_BOOTSTRAP } from "../src/lib/consentBootstrap.mjs";

function run(storage) {
    const dataLayer = [];
    const sandbox = {
        localStorage: {
            getItem(key) {
                if (storage instanceof Error) throw storage;
                if (Object.prototype.hasOwnProperty.call(storage, key)) return storage[key];
                return null;
            },
        },
        dataLayer,
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(CONSENT_MODE_BOOTSTRAP, sandbox);
    return dataLayer.map((entry) => {
        if (entry && entry[0] === "consent") {
            return { command: entry[0], type: entry[1], state: entry[2] };
        }
        if (entry && entry[0] === "js") return { command: "js" };
        return entry;
    });
}

function consentCommands(storage) {
    return run(storage).filter((entry) => entry.command === "consent");
}

const fresh = consentCommands({});
assert.equal(fresh.length, 1);
assert.equal(fresh[0].type, "default");
assert.equal(fresh[0].state.analytics_storage, "denied");
assert.equal(fresh[0].state.ad_storage, "denied");
assert.equal(fresh.some((entry) => entry.type === "update"), false);

const accepted = consentCommands({ cookieConsent: "all" });
assert.equal(accepted[0].type, "default");
assert.equal(accepted[1].type, "update");
assert.equal(accepted[1].state.analytics_storage, "granted");
assert.equal(accepted[1].state.ad_storage, "granted");
assert.ok(accepted.findIndex((entry) => entry.type === "update") < run({ cookieConsent: "all" }).findIndex((entry) => entry.command === "js"));

const necessary = consentCommands({ cookieConsent: "necessary" });
assert.equal(necessary[1].type, "update");
assert.equal(necessary[1].state.analytics_storage, "denied");
assert.equal(necessary[1].state.ad_storage, "denied");

const custom = consentCommands({
    cookieConsent: "custom",
    cookiePreferences: JSON.stringify({ analytics: true, marketing: false }),
});
assert.equal(custom[1].state.analytics_storage, "granted");
assert.equal(custom[1].state.ad_storage, "denied");
assert.equal(custom[1].state.ad_user_data, "denied");
assert.equal(custom[1].state.ad_personalization, "denied");

const coerced = consentCommands({
    cookieConsent: "custom",
    cookiePreferences: JSON.stringify({ analytics: "yes", marketing: 1 }),
});
assert.equal(coerced[1].state.analytics_storage, "denied");
assert.equal(coerced[1].state.ad_storage, "denied");

const broken = consentCommands({
    cookieConsent: "custom",
    cookiePreferences: "{",
});
assert.equal(broken[1].type, "update");
assert.equal(broken[1].state.analytics_storage, "denied");
assert.equal(broken[1].state.ad_storage, "denied");
assert.ok(run({ cookieConsent: "custom", cookiePreferences: "{" }).findIndex((entry) => entry.type === "update") < run({ cookieConsent: "custom", cookiePreferences: "{" }).findIndex((entry) => entry.command === "js"));

const unknown = consentCommands({ cookieConsent: "everything", cookiePreferences: JSON.stringify({ analytics: true, marketing: true }) });
assert.equal(unknown.length, 1);
assert.equal(unknown[0].state.analytics_storage, "denied");

const blocked = consentCommands(new Error("storage blocked"));
assert.equal(blocked.length, 1);
assert.equal(blocked[0].state.analytics_storage, "denied");

const acceptedQueue = run({ cookieConsent: "all" });
assert.equal(acceptedQueue.at(-1).command, "js");
assert.equal(acceptedQueue.filter((entry) => entry.command === "consent" && entry.type === "update").length, 1);

console.log("consent bootstrap tests passed");
