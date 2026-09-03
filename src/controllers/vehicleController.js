import Vehicle from '../models/Vehicle.js'; 
import { Op } from 'sequelize';
import crypto from 'node:crypto';

class VehicleController {
    async create(req, res) {
        try {
            const vehicleToCreate = {
                id: crypto.randomUUID(),
                ...req.body
            };

            const vehicle = await Vehicle.create(vehicleToCreate);
            
            return res.status(201).json(vehicle);

        } catch (error) {
            return res.status(400).json({ error: 'Erro ao cadastrar veículo. Verifique os dados enviados.', details: error.message });
        }
    }

    
    async index(req, res) {
        try {
            const vehicles = await Vehicle.findAll();
            return res.status(200).json(vehicles);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar veículos.' });
        }
    }

    async show(req, res) {
        try {
            const { identificador } = req.params;
            const vehicle = await Vehicle.findOne({
                where: {
                    [Op.or]: [
                        { id: isNaN(identificador) ? null : identificador },
                        { placa: identificador }
                    ]
                }
            });

            if (!vehicle) {
                return res.status(404).json({ error: 'Veículo não encontrado.' });
            }

            return res.status(200).json(vehicle);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar veículo.' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const vehicle = await Vehicle.findByPk(id);

            if (!vehicle) {
                return res.status(404).json({ error: 'Veículo não encontrado.' });
            }

            await vehicle.update(req.body);
            
            return res.status(200).json(vehicle);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao editar veículo.', details: error.message });
        }
    }

    async remove(req, res) {
        try {
            const { id } = req.params;
            const vehicle = await Vehicle.findByPk(id);

            if (!vehicle) {
                return res.status(404).json({ error: 'Veículo não encontrado.' });
            }

            await vehicle.destroy();
            return res.status(200).json({ message: 'Veículo removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao remover veículo.' });
        }
    }
}

export default new VehicleController();