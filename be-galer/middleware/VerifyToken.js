import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        // Ambil token dari header Authorization
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Token tidak ada atau format salah" });
        }

        const token = authHeader.split(' ')[1];

        // Verifikasi token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token tidak valid atau telah kedaluwarsa" });
            }

            // Simpan data token di req untuk middleware berikutnya
            req.userId = decoded.userId; // Jika `userId` disimpan dalam payload token
            req.email = decoded.email;  // Tambahkan email ke req jika diperlukan
            next();
        });
    } catch (error) {
        console.error("Error verifikasi token:", error.message);
        return res.status(500).json({ message: "Kesalahan server" });
    }
};
