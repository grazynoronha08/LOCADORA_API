import express from "express";
import UserController from "./controllers/userController.js";
import VehicleController from "./controllers/vehicleController.js";
import RentalController from "./controllers/rentalController.js";
import authMiddleware from "./database/middlewares/auth.js";
import adminMiddleware from './database/middlewares/adminMiddleware.js';


const router = express.Router()

// ROTAS DE USUÁRIO 
router.post('/cadastro/administrador', UserController.createAdmin);
router.post('/cadastro/cliente', UserController.createClient);
router.post('/login', UserController.login); 
router.get('/usuarios/todos', authMiddleware, adminMiddleware, UserController.getAllUser);
router.delete('/usuarios/deletar/:id', authMiddleware, UserController.deleteUser);

// ROTAS DE VEÍCULOS 
router.post('/veiculos', authMiddleware, adminMiddleware, VehicleController.create); 
router.put('/atualizar/:id', authMiddleware, adminMiddleware, VehicleController.update);
router.delete('/veiculos/deletar/:id', authMiddleware, adminMiddleware, VehicleController.remove);

// Rotas de leitura 
router.get('/veiculos/todos', VehicleController.index);
router.get('/buscar/:identificador', VehicleController.show);

// ROTAS DE ALUGUEL 
router.post('/alugar', authMiddleware, RentalController.create);
router.get('/alugueis/todos', authMiddleware, adminMiddleware, RentalController.index);
router.delete('/alugueis/cancelar/:id', authMiddleware, RentalController.cancel);


export default router