const crypto = require("crypto");

const GITHUB_SECRET = "prophone2025"; // This must match GitHub's secret

app.post("/prophone", (req, res) => {
  const signature = req.headers["x-hub-signature-256"];
  const computedSignature =
    "sha256=" +
    crypto.createHmac("sha256", prophone2025).update(JSON.stringify(req.body)).digest("hex");

  if (signature !== computedSignature) {
    return res.status(401).send("Unauthorized");
  }

  console.log("Webhook received:", req.body);
  res.status(200).send("Webhook received!");
});

