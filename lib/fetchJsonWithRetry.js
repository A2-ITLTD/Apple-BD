export async function fetchJsonWithRetry(url, { signal, retries = 1, ...options } = {}) {
  let attempt = 0;

  while (true) {
    try {
      const response = await fetch(url, { ...options, signal });
      let json;
      try {
        json = await response.json();
      } catch {
        json = {};
      }

      if (!response.ok) {
        const error = new Error(json.error || `Request failed (${response.status})`);
        error.status = response.status;
        if (response.status >= 500 && attempt < retries) {
          attempt += 1;
          continue;
        }
        throw error;
      }

      return json;
    } catch (error) {
      if (error.name === "AbortError") throw error;
      if (error.status && error.status < 500) throw error;
      if (attempt >= retries) throw error;
      attempt += 1;
    }
  }
}
