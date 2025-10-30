// utils/fetchFromHosts.js
const cache = {}; // cache tạm memory

export async function fetchFromHosts(key, hosts = [], options = {}) {
  if (cache[key]) return cache[key]; // nếu đã có cache thì dùng luôn

  const fetchWithTimeout = (url, timeout = 3000) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout")), timeout);
      fetch(url, options)
        .then((res) => {
          clearTimeout(timer);
          if (!res.ok) reject(new Error(`Failed at ${url} - ${res.status}`));
          else resolve(res.json());
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });

  const promises = hosts.map((host) =>
    fetchWithTimeout(host).catch((err) => {
      console.warn(`${host} lỗi: ${err.message}, bỏ qua...`);
      return Promise.reject();
    })
  );

  try {
    const data = await Promise.any(promises);
    cache[key] = data; // lưu cache
    return data;
  } catch (err) {
    console.error("Không thể lấy dữ liệu từ bất kỳ host nào", err);
    throw err;
  }
}

// Xóa cache nếu cần refresh
export function clearCache(key) {
  delete cache[key];
}
