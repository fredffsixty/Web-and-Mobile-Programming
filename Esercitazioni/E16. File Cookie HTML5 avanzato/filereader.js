function readTextFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.addEventListener(
            "load", () => resolve(reader.result));
        reader.addEventListener(
            "error", () => reject(reader.error));
        reader.readAsText(file);
    });
}