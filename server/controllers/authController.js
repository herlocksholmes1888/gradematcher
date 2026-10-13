import User from '../models/User.js';
import { generateToken, validateEmail } from '../utils/helpers.js';

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Por favor, forneça todos os campos' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Verificar se usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor, forneça email e senha' });
    }

    // Encontrar usuário e selecionar senha
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter perfil do usuário
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
