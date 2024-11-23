import { config } from "dotenv";
import { get } from "env-var";


config({ path: '.env' });

interface Envs {
  PORT: number;
}

export const envs: Envs = {
  PORT: get('PORT').required().asPortNumber(),
}