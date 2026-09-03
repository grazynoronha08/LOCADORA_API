import Rental from '../models/Rental.js';
import Vehicle from '../models/Vehicle.js'; 
import User from "../models/User.js";
import crypto from 'node:crypto';

class RentalController {
    async create(req, res) {
    try {
        const { usuario_id, veiculo_id, data_inicio, data_fim } = req.body;
        
        if (usuario_id !== req.userId) {
                return res.status(403).json({ error: 'Acesso negado. Você só pode realizar aluguéis para a sua própria conta.' });
            }
        
        const vehicle = await Vehicle.findByPk(veiculo_id);

        if (!vehicle) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }

        if (vehicle.status !== 'disponível' && vehicle.status !== 'disponivel') {
            return res.status(400).json({ error: 'Este veículo já está alugado ou indisponível.' });
        }

        const rentalToCreate = {
            id: crypto.randomUUID(), 
            ...req.body,
        };

        const rental = await Rental.create(rentalToCreate);

        await vehicle.update({ status: 'alugado' });

        return res.status(201).json(rental);

    } catch (error) {
        return res.status(400).json({ error: 'Erro ao registrar aluguel.', details: error.message });
    }
}
    async index(req, res) {
        try {
            const rentals = await Rental.findAll();
            return res.status(200).json(rentals);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar aluguéis.', details: error.message });
        }
    }

    async cancel(req, res) {
        try {
            const { id } = req.params;
            const idLogado = req.userId;
            const rental = await Rental.findByPk(id);

            if (!rental) {
                return res.status(404).json({ error: 'Aluguel não encontrado.' });
            }

            if (rental.usuario_id !== idLogado) {
                const usuarioLogado = await User.findByPk(idLogado);
                
                if (!usuarioLogado || !usuarioLogado.is_admin) {
                    return res.status(403).json({ 
                        error: 'Acesso negado. Você só pode cancelar os seus próprios aluguéis.' 
                    });
                }
            }

            const vehicle = await Vehicle.findByPk(rental.veiculo_id);

            await rental.destroy();

            if (vehicle) {
                await vehicle.update({ status: 'disponível' });
            }

            return res.status(200).json({ message: 'Aluguel cancelado e veículo liberado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cancelar aluguel.', details: error.message });
        }
    }
}

export default new RentalController();