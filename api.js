'use strict';

const bodyParser = require("body-parser");
let data = [];
let id = 0;

module.exports = function (app) {

  app.use(bodyParser());

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let result = [];
      let open = req.query.open;
      let id = req.query._id;
      let title = req.query.issue_title;
      let text = req.query.issue_text;
      let created = req.query.created_on;
      let updated = req.query.updated_on;
      let by = req.query.created_by;
      let to = req.query.assigned_to;
      let status = req.query.status_text;

      if(open) {
        open = req.query.open;
      } else {
        open = "any";
      }

      if(id) {
        id = req.query._id;
      } else {
        id = "any";
      }

      if(title) {
        title = req.query.issue_title;
      } else {
        title = "any";
      }

      if(text) {
        text = req.query.issue_text;
      } else {
        text = "any";
      }

      if(created) {
        created = req.query.created_on;
      } else {
        created = "any";
      }

      if(updated) {
        updated = req.query.updated_on;
      } else {
        updated = "any";
      }

      if(by) {
        by = req.query.created_by;
      } else {
        by = "any";
      }

      if(to) {
        to = req.query.assigned_to;
      } else {
        to = "any";
      }

      if(status) {
        status = req.query.status_text;
      } else {
        status = "any";
      }
      
      data.map((item) => {
        let ID = false;

        if(item[1].project !== project) {
          ID = true;
        }

        if(item[0]._id !== id && id !== "any") {
          ID = true;
        }

        if(item[0].issue_text !== text && text !== "any") {
          ID = true;
        }

        if(item[0].issue_title !== title && title !== "any") {
          ID = true;
        }

        if(item[0].created_on !== created && created !== "any") {
          ID = true;
        }

        if(item[0].updated_on !== updated && updated !== "any") {
          ID = true;
        }

        if(item[0].created_by !== by && by !== "any") {
          ID = true;
        }

        if(item[0].assigned_to !== to && to !== "any") {
          ID = true;
        }

        if(item[0].open !== open && open !== "any") {
          ID = true;
        }

        if(item[0].status_text !== status && status !== "any") {
          ID = true;
        }

        if(project !== item[1].project) {
          ID = true;
        }

        if(ID === false) {
          result.push(item[0]);
        }
      });

      res.status(200).json(result);
    })
    
    .post(function (req, res){
      let project = req.params.project;

      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.status(200).json({ error: "required field(s) missing" });
      }

      if(!req.body.assigned_to) {
        req.body.assigned_to = '';
      }

      if(!req.body.status_text) {
        req.body.status_text = '';
      }

      id++;
      data.push([{
        _id: id.toString(),
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        open: true,
        status_text: req.body.status_text
      }, { project: project }]);

      res.status(200).json(data[data.length - 1][0]);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      if(!req.body._id) {
        res.status(200).json({ error: "missing _id" });
      }

      for(let i = 0; i < data.length; i++) {

        
        let title = req.body.issue_title;
        let text = req.body.issue_text;
        let by = req.body.created_by;
        let to = req.body.assigned_to;
        let status = req.body.status_text;
        let ID = false;

        if(title) {
          data[i][0].issue_title = title;
          ID = true;
        }
  
        if(text) {
          data[i][0].issue_text = text;
          ID = true;
        }
  
        data[i][0].updated_on = new Date();
  
        if(by) {
          data[i][0].created_by = by;
          ID = true;
        }
  
        if(to) {
          data[i][0].assigned_to = to;
          ID = true;
        }
  
        if(status) {
          data[i][0].status_text = status;
          ID = true;
        }

        if(project === data[i][1].project) {
          
          if(ID === false) {
            res.status(200).json({ error: "no update field(s) sent", _id: req.body._id });
          }
        }

          if(data[i][0]._id === req.body._id) {
            let title = req.body.issue_title;
            let text = req.body.issue_text;
            let by = req.body.created_by;
            let to = req.body.assigned_to;
            let status = req.body.status_text;
            let ID = false;

            if(title) {
              data[i][0].issue_title = title;
              ID = true;
            }
      
            if(text) {
              data[i][0].issue_text = text;
              ID = true;
            }
      
            data[i][0].updated_on = new Date();
      
            if(by) {
              data[i][0].created_by = by;
              ID = true;
            }
      
            if(to) {
              data[i][0].assigned_to = to;
              ID = true;
            }
      
            if(status) {
              data[i][0].status_text = status;
              ID = true;
            }

            if(project === data[i][1].project) {
              if(ID === false) {
                res.status(200).json({ error: "no update field(s) sent", _id: req.body._id });
              }
            }

            if(project === data[i][1].project) {
              res.status(200).json({ result: "successfully updated", _id: req.body._id });
            }

            break;
          }
      }

      res.status(200).json({ error: "could not update", _id: req.body._id });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let id = req.body._id;
      
      if(!id) {
        res.status(200).json({ error: "missing _id" });
      }

      for(let i = 0; i < data.length; i++) {
        if(project === data[i][1].project) {
          if(data[i][0]._id === id) {
            data[i][0].open = false;
            res.status(200).json({ result: "successfully deleted", _id: id });
          }
        }
      }
      
      res.status(200).json({ error: "could not delete", _id: id });
    });
    
};
