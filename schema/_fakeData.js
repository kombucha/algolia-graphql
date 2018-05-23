const FAKE_APP = {
  id: "J29EWJOUDO",
  name: "movies app",
  type: "search",
  plan: {
    name: "free",
    label: "Community",
    team: false
  }
};

const FAKE_USER = {
  id: 42,
  name: "Vincent Lemeunier",
  avatar: "https://secure.gravatar.com/avatar/583a4916d8e7a5faf74b80db8a9c288b.png",
  email: '"vincent.lemeunier@algolia.com',
  applications: [FAKE_APP]
};

module.exports = { FAKE_APP, FAKE_USER };
