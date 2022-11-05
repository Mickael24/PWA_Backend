function TicketService(TicketModel) {
    let service = {
      create,
      findTicketsByGame,
      update,
      removeById,
    };
  
    function create(ticket) {
      let newTicket = TicketModel(ticket);
      return save(newTicket);
    }
  
    function save(model) {
      return new Promise(function (resolve, reject) {
        // do a thing, possibly async, then…
        model.save(function (err) {
          if (err) reject("There is a problema with register");
  
          resolve({
            message: "Ticket Created",
            ticket: model,
          });
        });
      });
    }
  
    function findTicketsByGame(gameId) {
      return new Promise(function (resolve, reject) {
        TicketModel.find({ gameId }, function (err, member) {
          if (err) reject(err);
          //object of all users
  
          if (!member) {
            reject("Tickets dont found");
          }
          resolve(member);
        });
      });
    }
  
    function update(id, ticket) {
      return new Promise(function (resolve, reject) {
        TicketModel.findByIdAndUpdate(id, ticket, function (err, ticketUpdated) {
          if (err) reject('Dont updated Ticket');
          resolve(ticketUpdated);
        });
      });
    }
  
    function removeById(id) {
      return new Promise(function (resolve, reject) {
        TicketModel.findByIdAndRemove(id, function (err) {
          if (err)
            reject({
              message: "Does not possible remove",
            });
  
          resolve();
        });
      });
    }
  
    return service;
  }
  
  module.exports = TicketService;
  