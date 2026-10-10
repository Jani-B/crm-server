"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitsService = getVisitsService;
exports.createVisitService = createVisitService;
const db_1 = require("../config/db");
async function getVisitsService(companyId) {
    const [rows] = await db_1.pool.query(`SELECT v.*, c.name as customer_name
        FROM visits v
        JOIN customers c
        on c.id = v.customer_id
        WHERE v.company_id = ?
        ORDER BY v.visited_at DESC`, [companyId]);
    return rows;
}
async function createVisitService(companyId, customerId, comment, visitedAt, scheduledVisitId) {
    const dateToUse = visitedAt && visitedAt !== ""
        ? new Date(visitedAt + "T00:00:00")
        : new Date();
    //as we are changing 2 things at the same time lets create a connection and transactino to pool
    const connection = await db_1.pool.getConnection();
    try {
        await connection.beginTransaction();
        //Lets check that the customer belongs to the company
        const [customerRows] = await connection.execute(`SELECT id
      FROM customers
      WHERE id = ?
      AND company_id = ?`, [customerId, companyId]);
        if (customerRows.length === 0) {
            throw new Error("Customer not found");
        }
        //if there is schechuled visit lets check it before addning the report
        if (scheduledVisitId !== undefined) {
            const [scheduledRows] = await connection.execute(`SELECT id, customer_id, user_id, scheduled_at, status
        FROM scheduled_visits
        WHERE id = ?
        AND company_id = ?
        FOR UPDATE`, [scheduledVisitId, companyId]);
            if (scheduledRows.length === 0) {
                throw new Error("Scheduled visit not found");
            }
            const scheduledVisit = scheduledRows[0];
            if (Number(scheduledVisit.customer_id) !== Number(customerId)) {
                throw new Error("Scheduled visit customer mismatch");
            }
            if (scheduledVisit.status !== "planned") {
                throw new Error("Scheduled visit is not planned");
            }
        }
        // lets save the visit
        await connection.execute(`INSERT INTO visits
      (customer_id, company_id, visited_at, comment)
      VALUES (?,?,?,?)`, [customerId, companyId, dateToUse, comment || null]);
        //after adding visit lets mark the scheduledVisit as done
        //but only if there was a schechuled visit given
        if (scheduledVisitId !== undefined) {
            await connection.execute(`UPDATE scheduled_visits
        SET status = 'completed'
        WHERE id = ?
        AND company_id = ?
        AND status = 'planned'`, [scheduledVisitId, companyId]);
        }
        await connection.commit();
    }
    catch (err) {
        await connection.rollback();
        throw err;
    }
    finally {
        connection.release();
    }
    /*
    const [customerRows]: any = await pool.execute(
      `SELECT id
        FROM customers
        WHERE id = ?
        AND company_id = ?`,
      [customerId, companyId],
    );
  
    if (customerRows.length === 0) {
      throw new Error("Customer not found");
    }
  
    await pool.execute(
      `INSERT INTO visits
        (customer_id, company_id, visited_at, comment)
        VALUES (?,?,?,?)`,
      [customerId, companyId, dateToUse, comment || null],
    );*/
}
