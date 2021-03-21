export interface Message {
  id: string;
  body: string;
  persistent: boolean;
  icon?: string;
  link?: string;
}
