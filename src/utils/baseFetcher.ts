const baseFetcher = (key: string, options = {}) =>
  fetch(key, options).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok" + key);
    }
    return res.json();
  });

export default baseFetcher;
