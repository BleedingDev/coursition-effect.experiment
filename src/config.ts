import { Config, ConfigProvider, Layer } from 'effect'

export const envVars = {
  PORT: Config.integer('PORT').pipe(Config.withDefault(3001)),
  PARSING_ENGINE_URL: Config.string('PARSING_ENGINE_URL').pipe(
    Config.withDefault('http://localhost:8080'),
  ),
  JOBS_TABLE: Config.string('JOBS_TABLE').pipe(
    Config.withDefault('jobs-table'),
  ),
  LOG_LEVEL: Config.string('LOG_LEVEL').pipe(Config.withDefault('info')),
} as const

const mockConfigProvider = ConfigProvider.fromJson({
  PORT: 3001,
  PARSING_ENGINE_URL: 'http://localhost:8080',
  JOBS_TABLE: 'jobs-table-test',
  LOG_LEVEL: 'debug',
})

export const MockConfigLayer = Layer.setConfigProvider(mockConfigProvider)
