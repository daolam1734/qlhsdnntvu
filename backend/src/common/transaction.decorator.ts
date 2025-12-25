import { Injectable } from '@nestjs/common';
import { Transactional } from 'nestjs-cls';

export const Transaction = Transactional;

/**
 * Decorator for transactional methods
 * Usage: @Transaction() async method() { ... }
 */
export function TransactionalMethod() {
  return Transactional();
}

/**
 * Service with built-in transaction support
 */
@Injectable()
export abstract class TransactionalService {
  /**
   * Execute operation in transaction
   * Override in concrete services
   */
  protected abstract executeInTransaction<T>(operation: () => Promise<T>): Promise<T>;
}