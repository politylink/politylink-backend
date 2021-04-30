export const initializeDatabase = (driver) => {
  const resources = ["Member", "Election", "Diet", "Law", "Bill", "Committee", "Minutes", "Url", "Timeline", "News", "Activity", "Speech", "BillAction"]
  const initCypher = resources.map(key => `CREATE CONSTRAINT ON (n:${key}) ASSERT n.id IS UNIQUE`)

  const executeQuery = (driver, cypher) => {
    const session = driver.session()
    return session
      .writeTransaction((tx) => tx.run(cypher))
      .then()
      .finally(() => session.close())
  }

  initCypher.forEach(cypher =>
    executeQuery(driver, cypher).catch((error) => {
      console.error('Database initialization failed to complete\n', error.message)
    })
  )
}
