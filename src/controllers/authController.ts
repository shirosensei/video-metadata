import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { hashPassword, comparePassword } from '../utils/hashUtils';
import { generateToken } from '../utils/jwtUtils';


export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(password);

        // Save a new user record in the database
        const user = userRepository.create({ username, email, password: hashedPassword });

        await userRepository.save(user);

        const token = generateToken({ id: user.id, username: user.username });

        res.status(201).json({ 
            message: 'Account created successfully', 
            token, 
            user: { id: user.id, username: user.username, email: user.email }
         });
    } catch (err: Error | any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await userRepository.findOne({ where: { email } });
        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken({ id: user.id, username: user.username });
        res.json({ 
            message: 'Login successful', 
            token, 
            user: { id: user.id, username: user.username, email: user.email }
         });
    } catch (err: Error | any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
