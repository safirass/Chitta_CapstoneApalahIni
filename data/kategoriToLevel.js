export const kategoriToLevel = (kategori) => {
switch (kategori) {
    case "Ringan": return 1;
    case "Sedang": return 2;
    case "Berat": return 3;
    case "Sangat Berat": return 4;
    default: return 1;
}
};
