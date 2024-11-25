import Users from "../models/UsersModel.js";

export const verifyUser = async(req, res, next) => {
        if(!req.session.userId){
                return res.status(401).json({msg: "Mohon login ke akun anda!"})
        }
        const user = await Users.findOne({
                where:{
                        uuid: req.session.userId
                }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        req.userId = user.id;
        req.role = user.role;
        next();
}

export const adminOnly = async(req, res, next) => {
        const user = await Users.findOne({
                where:{
                        uuid: req.session.userId
                }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        if(user.role !== "admin") return res.status(403).json({msg: "anda bukan admin."});
        next();
}

export const verifyLogin = (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
    
        if (!token) {
            req.role = "guest"; // Jika tidak ada token, anggap sebagai guest
            req.userId = null;
            return next();
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            req.role = decoded.role;
            next();
        } catch (err) {
            return res.status(403).json({ msg: "Token tidak valid" });
        }
    };