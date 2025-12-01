// ======== ÂM THANH: ENABLE / DISABLE ========
function speakNewOrder() {
  if (window.voiceInterval) clearInterval(window.voiceInterval);

  const text = 'Bạn có đơn hàng mới từ Ba Da Fu Ta Food!';
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'vi-VN';
  msg.volume = 1;
  msg.rate = 0.9;
  msg.pitch = 1.1;

  msg.text = text.replace('Ba Da Fu Ta', 'Ba-Đa-Phu-Ta').replace('Food', 'Phút');

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);

  window.voiceInterval = setInterval(() => {
    window.speechSynthesis.speak(msg);
  }, 5000);
}

function enableVoice() {
  const msg = new SpeechSynthesisUtterance('Hệ thống đã bật âm thanh đơn hàng');
  msg.lang = 'vi-VN';
  window.speechSynthesis.speak(msg);

  localStorage.setItem('voiceEnabled', '1');
  toast.success('Âm thanh thông báo đã bật');
}

// Gọi khi component load hoặc có đơn mới
if (localStorage.getItem('voiceEnabled') === '1') {
  speakNewOrder();
}
