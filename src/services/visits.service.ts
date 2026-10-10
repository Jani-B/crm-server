import { pool } from "../config/db";

export async function getVisitsService(companyId: number) {
  const [rows]: any = await pool.query(
    `SELECT v.*, c.name as customer_name
        FROM visits v
        JOIN customers c
        on c.id = v.customer_id
        WHERE v.company_id = ?
        ORDER BY v.visited_at DESC`,
    [companyId],
  );

  return rows;
}

export async function createVisitService(
  companyId: number,
  customerId: number,
  comment?: string,
  visitedAt?: string,
  scheduledVisitId?: number,
) {
  const dateToUse =
    visitedAt && visitedAt !== ""
      ? new Date(visitedAt + "T00:00:00")
      : new Date();

  //as we are changing 2 things at the same time lets create a connection and transactino to pool
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    //Lets check that the customer belongs to the company
    const [customerRows]: any = await connection.execute(
      `SELECT id
      FROM customers
      WHERE id = ?
      AND company_id = ?`,
      [customerId, companyId],
    );

    if (customerRows.length === 0) {
      throw new Error("Customer not found");
    }

    //if there is schechuled visit lets check it before addning the report
    if (scheduledVisitId !== undefined) {
      const [scheduledRows]: any = await connection.execute(
        `SELECT id, customer_id, user_id, scheduled_at, status
        FROM scheduled_visits
        WHERE id = ?
        AND company_id = ?
        FOR UPDATE`,
        [scheduledVisitId, companyId],
      );

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
    await connection.execute(
      `INSERT INTO visits
      (customer_id, company_id, visited_at, comment)
      VALUES (?,?,?,?)`,
      [customerId, companyId, dateToUse, comment || null],
    );

    //after adding visit lets mark the scheduledVisit as done
    //but only if there was a schechuled visit given
    if (scheduledVisitId !== undefined) {
      await connection.execute(
        `UPDATE scheduled_visits
        SET status = 'completed'
        WHERE id = ?
        AND company_id = ?
        AND status = 'planned'`,
        [scheduledVisitId, companyId],
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
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
