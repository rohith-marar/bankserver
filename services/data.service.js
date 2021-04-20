const db = require("./db")
let accountDetails = {
  1000: { acno: 1000, name: "userone", balance: 5000, password: "user1" },
  1001: { acno: 1001, name: "usertwo", balance: 5500, password: "user2" },
  1002: { acno: 1002, name: "userthree", balance: 6000, password: "user3" },
  1003: { acno: 1003, name: "userfour", balance: 7000, password: "user4" },
  1004: { acno: 1004, name: "userfive", balance: 6500, password: "user5" }


}
let currentUser;
const register = (acno, name, password) => {
  // console.log("register called");
  return db.User.findOne({ acno }).then(user => {
    console.log(user)
    if (user) {
      return {
        status: false,
        statusCode: 422,
        message: "User already exists ,please login"
      }
    }
    else {
      const newUser = new db.User({
        acno,
        name,
        balance: 0,
        password
      })
      newUser.save();
      return {
        status: true,
        statusCode: 200,
        message: "registeration successful"
      }
    }
  })
  //   if (acno in accountDetails) {

  //     return {
  //         status:false,
  //         statusCode:422,
  //         message:"User already exists ,please login"
  //     }
  //   }

  //   accountDetails[acno] = {
  //     acno,
  //     name,
  //     balance: 0,
  //     password
  //   }
  //  // this.saveDetails();

  //   console.log(this.accountDetails);
  //   return {
  //       status:true,
  //       statusCode:200,
  //       message:"registeration successful"
  //   }

}
const login = (req, acno, password) => {
  var ano = parseInt(acno);
  return db.User.findOne({
    acno: ano,
    password

  }).then(user => {
    if (user) {
      req.session.currentUser = user.acno
      return {
        status: true,
        statusCode: 200,
        message: "login successsful",
        name: user.name,
        acno: user.acno
      }
    }
    return {
      status: false,
      statusCode: 422,
      message: "invalid credentials"
    }
  })
  // let dataset = accountDetails
  // if (acno in dataset) {
  //   var pswd1 = dataset[acno].password;
  //   if (pswd1 == password) {
  //    req.session.currentUser=dataset[acno];
  //     //this.saveDetails();
  //     return{
  //         status:true,
  //         statusCode:200,
  //         message:"login successsful"
  //     }
  //   }
  //   else {

  //     return{
  //         status:false,
  //         statusCode:422,
  //         message:"incorrect password"
  //     }
  //   }
  // }
  // else {

  //   return{
  //     status:false,
  //     statusCode:422,
  //     message:"invalid accountNumber"
  //   }
  // }

}
const deposit = (acno, pswd, amount) => {

  var amt = parseInt(amount)
  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (!user) {
      return {
        status: false,
        statusCode: 422,
        message: "invalid account number"
      }
    }
    else {
      user.balance += amt;
      user.save();
      return {
        status: true,
        statusCode: 200,
        message: "Account has been credited with " + amount,
        balance: user.balance
      }
    }
  })
  // let dataset = accountDetails
  // if (acno in dataset) {
  //   var pswd1 = dataset[acno].password;
  //   if (pswd1 == pswd) {
  //     dataset[acno].balance += amt;
  //     //this.saveDetails();
  //     // alert("Amount credited with " + amount + " New balance is " + dataset[acno].balance)
  //     return {
  //       status: true,
  //       statusCode: 200,
  //       message: "Account has been credited with " + amount,
  //       balance: dataset[acno].balance
  //     }
  //   }
  //   else {
  //     return {
  //       status: false,
  //       statusCode: 422,
  //       message: "incorrect password"
  //     }
  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     statusCode: 422,
  //     message: "invalid account number"
  //   }
  // }
}
const withdraw = (req, acno, pswd, amount) => {
  var amt = parseInt(amount)
  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (!user) {
      return {
        status: false,
        statusCode: 422,
        message: "invalid accountnumber/password"
      }
    }
    if (req.session.currentUser != acno) {
      return {
        status: false,
        statusCode: 422,
        message: "Permission Denied"
      }
    }
    else if (user.balance < amt) {
      return {
        status: false,
        statusCode: 422,
        message: "Insufficient Balance"
      }
    }
    else {
      user.balance -= amt;
      user.save();
      return {
        status: true,
        statusCode: 200,
        message: "Account has been debited with " + amount,
        balance: user.balance
      }
    }

  })
  // let dataset = accountDetails
  // if (acno in dataset) {
  //   var pswd1 = dataset[acno].password;
  //   if (pswd1 == pswd) {
  //     if (amount > dataset[acno].balance) {
  //       return {
  //         status: false,
  //         statusCode: 422,
  //         message: "Insufficient Balance"
  //       }
  //     }
  //     else {
  //       dataset[acno].balance -= amt;
  //       // this.saveDetails();
  //       return {
  //         status: true,
  //         statusCode: 200,
  //         message: "Account has been debited with " + amount,
  //         balance: dataset[acno].balance
  //       }
  //     }
  //   }
  //   else {
  //     return {
  //       status: false,
  //       statusCode: 422,
  //       message: "incorrect password"
  //     }
  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     statusCode: 422,
  //     message: "invalid Accountnumber"
  //   }
  // }
}
const deleteAccDetails = (acno) => {
  return db.User.deleteOne({
    acno: acno
  }).then(user => {
    if (!user) {
      return {
        status: false,
        statusCode: 422,
        message: "Operation Denied"
      }
    }
    return {
      status: true,
      statusCode: 200,
      message: "Account number " + acno + " Deleted Successfully"

    }
  })
}
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  deleteAccDetails
}