import { Connection } from 'typeorm';

let connections: Map<string, Connection> = new Map();

export const setConnections = (conns: any) => {
  connections = conns;
};

export { connections };
