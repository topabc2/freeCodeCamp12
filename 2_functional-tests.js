const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { test } = require('mocha');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test("create issue with every field", function(done) {
    chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
            issue_title: "test",
            issue_text: "test",
            created_by: "test",
            assigned_to: "test",
            status_text: "test"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.include(res.text, '"issue_title":"test","issue_text":"test"');
            assert.include(res.text, '"created_by":"test","assigned_to":"test","open":true,"status_text":"test"')
            done();
        });
  });

  test("create issue with only required fields", function(done) {
    chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
            issue_title: "test",
            issue_text: "test",
            created_by: "test"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.include(res.text, '"issue_title":"test","issue_text":"test"');
            assert.include(res.text, '"created_by":"test","assigned_to":"","open":true,"status_text":""');
            done();
        });
  });

  test("create an issue with missing required fields", function(done) {
    chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
            issue_title: "test"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, '{"error":"required field(s) missing"}');
            done();
        });
  });

  test("view issues on a project", function(done) {
    chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.include(res.text, '"issue_title":"test","issue_text":"test"');
            assert.include(res.text, '"created_by":"test","assigned_to":"","open":true,"status_text":""');
            done();
        });
  });

  test("view issues on a project with one filter", function(done) {
    chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest?open=true")
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            done();
        });
  });

  test("view issues on a project with multiple filters", function(done) {
    chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest?open=true&issue_title=test")
        .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.isString(res.text);
            done();
        });
  });

  test("update one field on an issue", function(done) {
    chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
            _id: "test",
            issue_title: "not a test"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            done();
        });
  });

  test("update multiple fields on an issue", function(done) {
    chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
            _id: "test",
            issue_title: "test",
            issue_text: "test"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            done();
        });
  });

  test("update an issue with missing _id", function(done) {
    chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
            issue_title: "test"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, '{"error":"missing _id"}');
            done();
        });
  });

  test("update an issue with no fields to update", function(done) {
    chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
            _id: "test"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            done();
        });
  });

  test("update an issue with invalid _id", function(done) {
    chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
            _id: "tset"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            done();
        });
  });

  test("delete an issue", function(done) {
    chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({
            _id: "test"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            done();
        });
  });

  test("delete an issue with invalid _id", function(done) {
    chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({
            _id: 'tset'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, '{"error":"could not delete","_id":"tset"}');
            done();
        });
  });

  test("delete an issue with missing _id", function(done) {
    chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, '{"error":"missing _id"}');
            done();
        });
  });
});
