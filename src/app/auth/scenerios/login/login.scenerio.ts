import { Injectable } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class Login {
  constructor(private readonly authService: AuthService) {}
}
