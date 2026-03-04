import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import {
  badRequestResponse,
  internalError,
  unprocessableEntityResponse,
} from 'src/utils/error-handler/exception-helpers';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { UserRole } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserDto] })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return users.map((user) => ({ ...user }));
    } catch (error) {
      console.error('UsersController - findAll error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: UserDto })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return { ...user };
    } catch (error) {
      console.error('UsersController - findOne error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  async getProfile(@User() user: any) {
    try {
      const userId = user?.userId;
      if (!userId) {
        console.error('UsersController - Invalid userId:', userId);
        throw new Error('Invalid user ID');
      }
      const { ...rest } = await this.usersService.findOneById(userId);
      return { ...rest };
    } catch (error) {
      console.error('UsersController - getProfile error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserDto })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { ...user };
    } catch (error) {
      console.error('UsersController - create error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserDto })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      return { ...user };
    } catch (error) {
      console.error('UsersController - update error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: "Update current user's avatar" })
  @ApiResponse({
    status: 200,
    description: "Current user's avatar updated",
    type: UserDto,
  })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Patch('/me/avatar')
  async updateMyAvatar(@User() user: any, @Body('avatar') avatar: string) {
    try {
      const userId = user?.userId;
      if (!userId) {
        console.error(
          'UsersController - Invalid userId for updateMyAvatar:',
          userId,
        );
        throw new Error('Invalid user ID');
      }
      const avatarData = avatar;
      if (!avatarData) {
        throw new BadRequestException('Avatar data is required.');
      }
      const updatedUser = await this.usersService.updateAvatar(
        userId,
        avatarData,
      );
      return { ...updatedUser };
    } catch (error) {
      console.error('UsersController - updateMyAvatar error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({
    status: 200,
    description: 'User status updated',
    type: UserDto,
  })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    try {
      const user = await this.usersService.updateStatus(
        id,
        updateUserStatusDto.isActive,
      );
      return { ...user };
    } catch (error) {
      console.error('UsersController - updateStatus error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update user avatar' })
  @ApiResponse({
    status: 200,
    description: 'User avatar updated',
    type: UserDto,
  })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Patch(':id/avatar')
  async updateAvatar(@Param('id') id: string, @Body('avatar') avatar: string) {
    try {
      const user = await this.usersService.updateAvatar(id, avatar);
      return { ...user };
    } catch (error) {
      console.error('UsersController - updateAvatar error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiBadRequestResponse(badRequestResponse)
  @ApiInternalServerErrorResponse(internalError)
  @ApiUnprocessableEntityResponse(unprocessableEntityResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error('UsersController - remove error:', error);
      throw error;
    }
  }
}
