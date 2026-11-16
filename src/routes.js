import express from "express";
import UserController from "./controllers/userController.js";
import VehicleController from "./controllers/vehicleController.js";
import RentalController from "./controllers/rentalController.js";
import PaymentController from "./controllers/paymentController.js";
import InsuranceController from "./controllers/insuranceController.js";
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
router.get('/veiculos/todos', VehicleController.index);
router.get('/buscar/:identificador', VehicleController.show);
router.get('/veiculos/busca', VehicleController.search);

// ROTAS DE ALUGUEL 
router.post('/alugar', authMiddleware, RentalController.create);
router.get('/alugueis/todos', authMiddleware, adminMiddleware, RentalController.index);
router.delete('/alugueis/cancelar/:id', authMiddleware, RentalController.cancel);

// ROTAS DE PAGAMENTO
router.get('/pagamentos/relatorio', authMiddleware, adminMiddleware, PaymentController.relatorio);
router.post('/pagamentos', authMiddleware, PaymentController.create);
router.get('/pagamentos/todos',authMiddleware, adminMiddleware, PaymentController.getAll);
router.get('/pagamentos/:id', authMiddleware, PaymentController.getById);
router.put('/pagamentos/:id', authMiddleware, adminMiddleware, PaymentController.update);
router.delete('/pagamentos/:id', authMiddleware, adminMiddleware, PaymentController.delete);

// ROTAS DO SEGURO
router.get('/seguro/relatorio', authMiddleware, adminMiddleware, InsuranceController.relatorio) ;
router.get('/seguro/relatorio/tipos', authMiddleware, adminMiddleware, InsuranceController.relatorioPorTipo);
router.post('/seguros', authMiddleware, InsuranceController.create);
router.get('/seguros/:identificador',  authMiddleware, InsuranceController.show);
router.put('/seguros/:id', authMiddleware, adminMiddleware, InsuranceController.update);
router.patch('/seguros/cancelar/:id', authMiddleware, adminMiddleware, InsuranceController.cancel);

export default router