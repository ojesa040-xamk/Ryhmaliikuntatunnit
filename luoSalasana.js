let hash = require("crypto").createHash("SHA256").update("koira123").digest("hex");

console.log(hash);