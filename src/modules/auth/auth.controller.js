// src/modules/auth/auth.controller.js
const { authenticateUser } = require('./auth.service');

const loginUser = async (req, res) => {
    const { username, password, rememberMe } = req.body;

    try {
        const token = await authenticateUser(username, password, rememberMe);
        
        // Token'ı HTTP-only ve Secure olarak cookie'ye kaydet
        // Secure: Üretim ortamında sadece HTTPS üzerinde çalışır
        res.cookie('auth-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None', // veya 'None'
            domain: '.zit.lol' // Tüm alt alan adları için
        });

        // Başarılı giriş yanıtı gönder, token olmadan
        res.status(200).json({ message: 'Giriş başarılı.' });

    } catch (error) {
        // Service'den gelen hataları yakala ve yanıt gönder
        res.status(401).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    // Cookie'yi temizle
    res.clearCookie('auth-token');
    res.status(200).json({ message: 'Çıkış yapıldı.' });
};

const verifyToken = (req, res, next) => {
    // Cookie'den token'ı al
    const token = req.cookies['auth-token'];

    if (!token) {
        return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Token içindeki bilgileri isteğe ekle
        next(); // Bir sonraki middleware veya rotaya geç
    } catch (error) {
        res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }
};

const checkAuthStatus = (req, res) => {
    // Eğer verifyToken middleware'i token'ı doğruladıysa, buraya ulaşılır.
    // Bu, kullanıcının giriş yaptığını gösterir.
    res.status(200).json({ message: 'Kullanıcı giriş yapmış.', user: req.user });
};

module.exports = {
    loginUser,
    logoutUser,
    verifyToken,
    checkAuthStatus
};