// Immediate thank-you sent right after form submission.
export const buildThankYouMessage = (name: string) =>
  `Halo ${name}! 🙏 Terima kasih sudah mendaftar untuk GKDI Tangerang 31st Anniversary "Forward". Sampai jumpa!`;

// Pre-filled as if the registrant themselves is opening the chat with
// the connect team right after submitting the Keep in Touch form.
export const buildConnectNotification = (name: string) =>
  `Halo, saya ${name}. Saya tertarik ikut acara HUT ke-31 GKDI Tangerang dan ingin kenal lebih dekat dengan komunitas di sini. Boleh dibantu infokan lebih lanjut?`;

// Pre-filled when tapping the contact link on the event detail section.
export const CONTACT_INQUIRY_MESSAGE =
  "Halo, saya ingin bertanya tentang acara HUT ke-31 GKDI Tangerang \"Forward\".";
