import Users from "../models/UsersModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
        try {
            const user = await Users.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    
            const match = await argon2.verify(user.password, req.body.password);
            if (!match) return res.status(400).json({ msg: "Password salah!" });
    
            // Buat Access dan Refresh Token
            const userId = user.id;
            const uuid = user.uuid;
            const name = user.name;
            const email = user.email;
            const role = user.role;
    
            const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "50s", // Access token lebih singkat
            });
            const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: "1d",
            });
    
            // Simpan refresh token di database
            await Users.update({ refresh_token: refreshToken }, { where: { id: userId } });
    
            // Simpan refresh token di cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                // Tambahkan opsi secure jika di lingkungan produksi
                secure: process.env.NODE_ENV === "production", // Hanya aktif di lingkungan produksi
            });
    
            // Simpan session
            req.session.userId = uuid;
    
            res.status(200).json({ uuid, name, email, role, accessToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Terjadi kesalahan server" });
        }
};

export const Me = async(req, res) => {
        if(!req.session.userId){
                return res.status(401).json({msg: "Mohon login ke akun anda!"})
        }
        const user = await Users.findOne({
                attributes:['uuid', 'name', 'email', 'role'],
                where:{
                        uuid: req.session.userId
                }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        res.status(200).json(user);
}

export const Logout = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                req.session.destroy((err) => {
                    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
                    return res.status(200).json({ msg: "Anda telah logout" });
                });
                return;
            }
    
            const user = await Users.findOne({
                where: {
                    refresh_token: refreshToken,
                },
            });
            if (!user) return res.sendStatus(204);
    
            const userId = user.id;
    
            // Hapus refresh token di database
            await Users.update({ refresh_token: null }, { where: { id: userId } });
    
            // Hapus refresh token dari cookie
            res.clearCookie("refreshToken");
    
            // Hancurkan session
            req.session.destroy((err) => {
                if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
                return res.status(200).json({ msg: "Anda telah logout" });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Terjadi kesalahan server" });
        }
    };