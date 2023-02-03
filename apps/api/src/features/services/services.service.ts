import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ServiceDto, ServiceNoId } from 'dtos';

import { OperatorsService } from 'features/operators/operators.service';
import { ServicesRepository } from 'features/services/services.repository';

@Injectable()
export class ServicesService {
  constructor(
    @Inject(forwardRef(() => OperatorsService))
    private readonly operatorsService: OperatorsService,
    private readonly servicesRepository: ServicesRepository,
  ) {}

  async getServicesForOperator(operatorId: string) {
    return await this.servicesRepository.getServicesForOperator(operatorId);
  }

  async getService(id: string) {
    return await this.servicesRepository.getService(id);
  }

  async getServiceByIdWithOperator(id: string) {
    const service = await this.getService(id);

    return {
      service,
      operator: await this.operatorsService.getOperatorById(
        service.operator as unknown as string,
      ),
    };
  }

  async createService(service: ServiceNoId) {
    return await this.servicesRepository.createService(service);
  }

  async updateService(id: string, newService: Partial<ServiceDto>) {
    return await this.servicesRepository.updateService(id, newService);
  }

  async deleteService(id: string) {
    return await this.servicesRepository.deleteService(id);
  }
}