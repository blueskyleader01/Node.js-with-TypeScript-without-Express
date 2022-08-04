import { error } from "console";
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

export class PgsDb {
  public pgsClient: any;

  constructor() {
    this.pgsClient = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });

  }

  public async getRows(query: string) {
    const _self = this;
    return new Promise(function (resolve: any, reject: any) {
      _self.pgsClient.query(query, (error: any, response: any) => {
        if (response === undefined) {
          resolve({});
        } else {
          resolve(response.rows);
        }
      });
    });
  }

  public async sqlQueryExce(query: any) {
    const _self = this;
    return new Promise(function (resolve: any, reject: any) {
      _self.pgsClient.query(query, (error: any, response: any) => {
        if (response) {
          if(response.rows.length > 0){
            resolve(response.rows[0].id);
          }else{
            resolve(true);
          }
        } else {
          resolve(false);
        }
      });
    });
  }

}

