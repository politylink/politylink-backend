const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')
const gql = require('graphql-tag')


const members = JSON.parse(readFileSync(`./sample/members.json`, `UTF-8`))
const elections = JSON.parse(readFileSync(`./sample/elections.json`, `UTF-8`))
const bills = JSON.parse(readFileSync(`./sample/bills.json`, `UTF-8`))
const diets = JSON.parse(readFileSync(`./sample/diets.json`, `UTF-8`))
const laws = JSON.parse(readFileSync(`./sample/laws.json`, `UTF-8`))
const meetings = JSON.parse(readFileSync(`./sample/meetings.json`, `UTF-8`))
const minutes = JSON.parse(readFileSync(`./sample/minutes.json`, `UTF-8`))


export const getSeedMutations = () => {
  const mutations = generateMutations([0,1,2])

  return mutations
}

const generateMutations = (records) => {
  return records.map((rec, index) => {
    let hash = {};
    hash["law_string"] = Object.keys(laws[index]).map((key, value) => `${key}: ${value}`).join(" , ");
    hash["bill_string"] = Object.keys(bills[index]).map((key, value) => `${key}: ${value}`).join(" , ");
    hash["diet_string"] = Object.keys(diets[index]).map((key, value) => `${key}: ${value}`).join(" , ");
    hash["election_string"] = Object.keys(elections[index]).map((key, value) => `${key}: ${value}`).join(" , ");
    hash["meeting_string"] = Object.keys(meetings[index]).map((key, value) => `${key}: ${value}`).join(" , ");
    hash["minute_string"] = Object.keys(minutes[index]).map((key, value) => `${key}: ${value}`).join(" , ");
    hash["member_string"] = Object.keys(members[index]).map((key, value) => `${key}: ${value}`).join(" , ");

    return {
      mutation: gql`
      mutation {
        law: MergeLaw($law_string) {
          id
        }
        bill: MergeBill($bill_string) {
          id
        }
        diet: MergeDiet($diet_string) {
          id
        }
        election: MergeElection($election_string) {
          id
        }
        meeting: MergeMeeting($meeting_string) {
          id
        }
        member: MergeMember($member_string) {
          id
        }
        minute: MergeMinute($minute_string) {
          id
        }
      }
      `,
      variables: hash,
    }
  })
}
