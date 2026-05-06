import { mailerServices } from '../services';
import { mailerUseCases } from '../use-cases';

export const mailerProviders = [...mailerServices, ...mailerUseCases];
