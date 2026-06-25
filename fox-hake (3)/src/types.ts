/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppState = 'splash' | 'requirements' | 'login' | 'platform' | 'game';

export type Platform = 'wowbet' | 'megapari' | '1xbet' | 'melbet';

export interface PlatformConfig {
  id: Platform;
  name: string;
  logo: string;
  promo: string;
}

export interface GameRowState {
  multiplier: number;
  predictedCol: number | null; // 0 to 4 columns
}

export interface UserSession {
  userId: string;
  promoCode: string;
  platform: Platform | null;
}
