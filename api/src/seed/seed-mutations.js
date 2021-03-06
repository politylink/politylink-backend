// const fetch = require('node-fetch')
// const parse = require('csv-parse/lib/sync')
const gql = require('graphql-tag')

const members = require('./sample/members')
const bills = require('./sample/bills')
const diets = require('./sample/diets')
const laws = require('./sample/laws')
const committees = require('./sample/committees.json')
const minutes = require('./sample/minutes')

export const getSeedMutations = () => {
  const mutations = generateMutations([0,1]) // Use two demo data

  return mutations
}

// https://github.com/dupski/json-to-graphql-query (MIT)
function stringify(obj_from_json) {
  if (obj_from_json instanceof Number) {
      return obj_from_json.value;
  }
  // variables should be prefixed with dollar sign and not quoted
  else if (obj_from_json instanceof String) {
      return `$${obj_from_json.value}`;
  }
  // Cheers to Derek: https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
  else if (typeof obj_from_json !== 'object' || obj_from_json === null) {
      // not an object, stringify using native function
      if (typeof obj_from_json === 'string' && obj_from_json.match(/^[A-Z]+$/)) {
          return obj_from_json;
      }
      return JSON.stringify(obj_from_json);
  }
  else if (Array.isArray(obj_from_json)) {
      return `[${obj_from_json.map((item) => stringify(item)).join(', ')}]`;
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props = Object
      .keys(obj_from_json)
      .map((key) => `${key}: ${stringify(obj_from_json[key])}`)
      .join(', ');

  return `{${props}}`;
}

const generateMutations = (records) => {
  return records.map((rec, index) => {
    let hash = {};
    const law_string = Object.keys(laws[index % laws.length]).filter(key => ! Array.isArray(laws[index % laws.length][key])).map((key, value) => `${key}: ${stringify(laws[index % laws.length][key])}`).join(" , ");
    const bill_string = Object.keys(bills[index % bills.length]).filter(key => ! Array.isArray(bills[index % bills.length][key])).map((key, value) => `${key}: ${stringify(bills[index % bills.length][key])}`).join(" , ");
    const diet_string = Object.keys(diets[index % diets.length]).filter(key => ! Array.isArray(diets[index % diets.length][key])).map((key, value) => `${key}: ${stringify(diets[index % diets.length][key])}`).join(" , ");
    const committee_string = Object.keys(committees[index % committees.length]).filter(key => ! Array.isArray(committees[index % committees.length][key])).map((key, value) => `${key}: ${stringify(committees[index % committees.length][key])}`).join(" , ");
    const minute_string = Object.keys(minutes[index % minutes.length]).filter(key => ! Array.isArray(minutes[index % minutes.length][key])).map((key, value) => `${key}: ${stringify(minutes[index % minutes.length][key])}`).join(" , ");
    const member_string = Object.keys(members[index % members.length]).filter(key => ! Array.isArray(members[index % members.length][key])).map((key, value) => `${key}: ${stringify(members[index % members.length][key])}`).join(" , ");
    const law_merge = `from: { id: 1 }, to: { id: 2 }`

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
        committee: MergeCommittee(${committee_string}) {
          id
        }
        member: MergeMember(${member_string}) {
          id
        }
        minute: MergeMinutes(${minute_string}) {
          id
        }
        laws: MergeLawBeReferredByLaws(${law_merge}) {
          from {
            id
          }
          to {
            id
          }
        }
      }
      `,
      variables: hash,
    }
  })
}
