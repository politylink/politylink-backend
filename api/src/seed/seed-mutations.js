const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')
const gql = require('graphql-tag')
const members = require('./sample/members')
const elections = require('./sample/elections')
const bills = require('./sample/bills')
const diets = require('./sample/diets')
const laws = require('./sample/laws')
const meetings = require('./sample/meetings')
const minutes = require('./sample/minutes')


export const getSeedMutations = () => {
  const mutations = generateMutations([0,1,2])

  return mutations
}

const generateMutations = (records) => {
  return records.map((rec, index) => {
    let hash = {};
    const law_string = Object.keys(laws[index % laws.length]).map((key, value) => `${key}: ${laws[index % laws.length][key]}`).join(" , ");
    const bill_string = Object.keys(bills[index % bills.length]).map((key, value) => `${key}: ${bills[index % bills.length][key]}`).join(" , ");
    const diet_string = Object.keys(diets[index % diets.length]).map((key, value) => `${key}: ${value}`).join(" , ");
    const election_string = Object.keys(elections[index % elections.length]).map((key, value) => `${key}: ${value}`).join(" , ");
    const meeting_string = Object.keys(meetings[index % meetings.length]).map((key, value) => `${key}: ${value}`).join(" , ");
    const minute_string = Object.keys(minutes[index % minutes.length]).map((key, value) => `${key}: ${value}`).join(" , ");
    const member_string = Object.keys(members[index % members.length]).map((key, value) => `${key}: ${value}`).join(" , ");

    return {
      mutation: gql`
      mutation {
        law: MergeLaw(${law_string}) {
          id
        }
        bill: MergeBill(${bill_string}) {
          id
        }
        diet: MergeDiet(${diet_string}) {
          id
        }
        election: MergeElection(${election_string}) {
          id
        }
        meeting: MergeMeeting(${meeting_string}) {
          id
        }
        member: MergeMember(${member_string}) {
          id
        }
        minute: MergeMinute(${minute_string}) {
          id
        }
      }
      `,
      variables: hash,
    }
  })
}
