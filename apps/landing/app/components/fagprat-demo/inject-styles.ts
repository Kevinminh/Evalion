// Style injection helpers ported from html-mockups/fagprat-demo.html.
// Each helper writes a <style> tag into the iframe's document so the embedded
// page hides its own chrome/nav and matches the demo's framing.

const LAPTOP_STYLE_ID = "demo-hide-nav";
const IPAD_STYLE_ID = "demo-hide-nav";
const PHONE_STYLE_ID = "demo-phone-style";

export function hideLaptopNav(doc: Document | null | undefined): void {
  if (!doc) return;
  try {
    if (doc.getElementById(LAPTOP_STYLE_ID)) return;
    const style = doc.createElement("style");
    style.id = LAPTOP_STYLE_ID;
    style.textContent =
      ".step-nav-bar{display:none !important;}" +
      ".btn-end-activity{display:none !important;}" +
      ".btn-record-topbar{display:none !important;}";
    doc.head.appendChild(style);
  } catch {
    // cross-origin or doc not ready — ignore
  }
}

export function cleanIpadDoc(
  doc: Document | null | undefined,
  nickname: string | null,
): void {
  if (!doc) return;
  try {
    doc.querySelectorAll(".ipad-portrait").forEach((el) => {
      const col = el.closest(".device-col");
      (col ?? el).remove();
    });
    doc
      .querySelectorAll(".page-title, .step-nav-bar, .device-label")
      .forEach((el) => el.remove());
    if (nickname) {
      doc.querySelectorAll(".sv-nickname-badge").forEach((el) => {
        el.textContent = nickname;
      });
    }
    if (doc.getElementById(IPAD_STYLE_ID)) return;
    const style = doc.createElement("style");
    style.id = IPAD_STYLE_ID;
    style.textContent = [
      "html,body{background:transparent !important;background-color:transparent !important;margin:0 !important;padding:0 !important;overflow:hidden !important;}",
      ".page-title,.step-nav-bar{display:none !important;}",
      ".ipad-portrait{display:none !important;}",
      ".device-col:has(.ipad-portrait){display:none !important;}",
      ".device-label{display:none !important;}",
      ".devices-row{display:flex !important;flex-direction:row !important;justify-content:center !important;align-items:flex-start !important;gap:0 !important;padding:0 !important;margin:0 !important;background:transparent !important;}",
      ".device-col{background:transparent !important;padding:0 !important;margin:0 !important;}",
      ".sv-disclaimer{display:none !important;}",
    ].join("");
    doc.head.appendChild(style);
  } catch {
    // ignore
  }
}

export function cleanPhoneDoc(doc: Document | null | undefined): void {
  if (!doc) return;
  try {
    doc
      .querySelectorAll(".external-tabs, .page-title, .phone-label")
      .forEach((el) => el.remove());
    if (doc.getElementById(PHONE_STYLE_ID)) return;
    const style = doc.createElement("style");
    style.id = PHONE_STYLE_ID;
    style.textContent = [
      "html,body{background:transparent !important;background-color:transparent !important;padding:0 !important;margin:0 !important;min-height:0 !important;overflow:hidden !important;}",
      ".phone-wrapper{gap:0 !important;padding:0 !important;margin:0 !important;height:100% !important;justify-content:center !important;}",
      ".iphone-frame{margin:0 auto !important;}",
      ".external-tabs,.page-title,.phone-label{display:none !important;}",
    ].join("");
    doc.head.appendChild(style);
  } catch {
    // ignore
  }
}
