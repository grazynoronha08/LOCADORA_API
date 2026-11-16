import { QueryTypes } from 'sequelize';
import Insurance from '../models/Insurance.js';
import Rental from '../models/Rental.js';
import User from '../models/User.js';

class InsuranceController {
  async create(req, res) {
    try {
      const { aluguel_id, tipo_seguro, valor } = req.body;

      const aluguel = await Rental.findByPk(aluguel_id);
      if (!aluguel) {
        return res.status(404).json({ error: 'Aluguel não encontrado.' });
      }

      const idLogado = req.userId;
      if (aluguel.usuario_id !== idLogado) {
        const usuarioLogado = await User.findByPk(idLogado);
        if (!usuarioLogado || !usuarioLogado.is_admin) {
          return res.status(403).json({
            error: 'Acesso negado. Você só pode contratar seguro para os seus próprios aluguéis.',
          });
        }
      }

      const insurance = await Insurance.create({
        aluguel_id,
        tipo_seguro,
        valor,
        status: 'ativo',
      });

      return res.status(201).json(insurance);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao registrar seguro.', details: error.message });
    }
  }

  async show(req, res) {
    try {
      const { identificador } = req.params;
      if (isNaN(identificador)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const insurance = await Insurance.findByPk(identificador);
      if (!insurance) {
        return res.status(404).json({ error: 'Seguro não encontrado.' });
      }

      const rental = await Rental.findByPk(insurance.aluguel_id);
      const idLogado = req.userId;

      if (rental && rental.usuario_id !== idLogado) {
        const usuarioLogado = await User.findByPk(idLogado);
        if (!usuarioLogado || !usuarioLogado.is_admin) {
          return res.status(403).json({
            error: 'Acesso negado. Você só pode visualizar os seus próprios seguros.',
          });
        }
      }

      return res.status(200).json(insurance);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar seguro.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const insurance = await Insurance.findByPk(id);

      if (!insurance) {
        return res.status(404).json({ error: 'Seguro não encontrado.' });
      }

      await insurance.update(req.body);
      return res.status(200).json(insurance);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao editar seguro.', details: error.message });
    }
  }

  async cancel(req, res) {
    try {
      const { id } = req.params;
      const insurance = await Insurance.findByPk(id);

      if (!insurance) {
        return res.status(404).json({ error: 'Seguro não encontrado.' });
      }

      const rental = await Rental.findByPk(insurance.aluguel_id);
      const idLogado = req.userId;

      if (rental && rental.usuario_id !== idLogado) {
        const usuarioLogado = await User.findByPk(idLogado);
        if (!usuarioLogado || !usuarioLogado.is_admin) {
          return res.status(403).json({
            error: 'Acesso negado. Você só pode cancelar os seus próprios seguros.',
          });
        }
      }

      await insurance.update({ status: 'inativo' });
      return res.status(200).json({ message: 'Seguro cancelado com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cancelar seguro.', details: error.message });
    }
  }

  async relatorio(req, res) {
    try {
      const relatorio = await Insurance.count({ where: { status: 'ativo' } });
      return res.status(200).json({ seguros_ativos: relatorio });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao gerar relatório.', details: error.message });
    }
  }

  async relatorioPorTipo(req, res) {
    try {
      const relatorio = await Insurance.sequelize.query(
        `
        SELECT
          tipo_seguro,
          COUNT(*)   AS total_seguros,
          SUM(valor) AS valor_total,
          MIN(valor) AS menor_valor,
          MAX(valor) AS maior_valor
        FROM insurances
        WHERE status = 'ativo'
        GROUP BY tipo_seguro
        ORDER BY valor_total DESC;
        `,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json(relatorio);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao gerar relatório por tipo.', details: error.message });
    }
  }
}

export default new InsuranceController();