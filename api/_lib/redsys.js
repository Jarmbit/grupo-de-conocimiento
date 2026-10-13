import crypto from "node:crypto";

export const REDSYS_URLS = {
  test: "https://sis-t.redsys.es:25443/sis/realizarPago",
  live: "https://sis.redsys.es/sis/realizarPago",
};

export const SIGNATURE_VERSION = "HMAC_SHA256_V1";

export function getConfig(env = process.env) {
  const merchantCode = env.REDSYS_MERCHANT_CODE;
  const terminal = env.REDSYS_TERMINAL || "1";
  const secretKey = env.REDSYS_SECRET_KEY;
  const mode = env.REDSYS_ENV === "live" ? "live" : "test";
  const siteUrl = env.SITE_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "");

  if (!merchantCode || !secretKey || !siteUrl) return null;
  return { merchantCode, terminal, secretKey, mode, siteUrl: siteUrl.replace(/\/$/, "") };
}

// Clave de operación: 3DES-CBC (IV a cero, sin padding automático) del nº de pedido
// rellenado con ceros hasta múltiplo de 8, usando la clave secreta del comercio.
function deriveKey(secretKeyBase64, order) {
  const key = Buffer.from(secretKeyBase64, "base64");
  const orderBuf = Buffer.from(order, "utf8");
  const padded = Buffer.concat([orderBuf, Buffer.alloc((8 - (orderBuf.length % 8)) % 8)]);
  const cipher = crypto.createCipheriv("des-ede3-cbc", key, Buffer.alloc(8));
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(padded), cipher.final()]);
}

export function sign(merchantParametersBase64, order, secretKeyBase64) {
  const derived = deriveKey(secretKeyBase64, order);
  return crypto.createHmac("sha256", derived).update(merchantParametersBase64).digest("base64");
}

export function encodeParameters(params) {
  return Buffer.from(JSON.stringify(params), "utf8").toString("base64");
}

// Redsys devuelve base64 "URL-safe" (- y _) y a veces sin relleno "=".
function normalizeBase64(value) {
  return String(value).replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
}

export function decodeParameters(merchantParametersBase64) {
  const json = Buffer.from(normalizeBase64(merchantParametersBase64), "base64").toString("utf8");
  return JSON.parse(json);
}

export function signaturesMatch(received, expected) {
  const a = Buffer.from(normalizeBase64(received));
  const b = Buffer.from(normalizeBase64(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Ds_Merchant_Order: 12 caracteres, los 4 primeros numéricos, el resto alfanumérico.
export function generateOrder() {
  const digits = String(crypto.randomInt(0, 10000)).padStart(4, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 8; i++) tail += alphabet[crypto.randomInt(0, alphabet.length)];
  return digits + tail;
}

// Códigos 0000-0099: operación autorizada.
export function isAuthorised(responseCode) {
  const n = Number.parseInt(responseCode, 10);
  return Number.isInteger(n) && n >= 0 && n <= 99;
}
