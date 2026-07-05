import { Client } from "./Client.js";

export abstract class Resource {
  protected readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
