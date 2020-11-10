export const initializeDatabase = async(driver) => {
  const resources = ["Member", "Election", "Diet", "Law", "Bill", "Committee", "Minutes", "Url", "Timeline", "News"]
  const initCypher = resources.map(key => `CREATE CONSTRAINT ON (n:${key}) ASSERT n.id IS UNIQUE`)

  const executeQuery = async(driver, cypher) => {
    const session = driver.session()
    return session
      .writeTransaction((tx) => tx.run(cypher))
      .then()
      .finally(() => session.close())
  }

  for(let cypher of initCypher) { 
  //initCypher.forEach(async(cypher) => 
    await executeQuery(driver, cypher).catch((error) => {
      console.error('Database initialization failed to complete\n', error.message)
    })
  }
  //)
}
