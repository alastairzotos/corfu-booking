import { OperatorDto, OperatorNoId, ServiceDto } from "dtos";
import { httpClient } from "src/services/http.service";

export class OperatorsService {
  async getOperators(): Promise<OperatorDto[]> {
    const { data } = await httpClient.get<OperatorDto[]>("/operators");

    return data;
  }

  async getOperator(id: string): Promise<OperatorDto> {
    const { data } = await httpClient.get<OperatorDto>(`/operators/${id}`);

    return data;
  }

  async getOperatorWithServicesById(
    id: string
  ): Promise<{ operator: OperatorDto; services: ServiceDto[] }> {
    const { data } = await httpClient.get<{
      operator: OperatorDto;
      services: ServiceDto[];
    }>(`/operators/with-services/${id}`);

    return data;
  }

  async createOperator(operator: OperatorNoId): Promise<string> {
    const { data } = await httpClient.post<
      any,
      { data: string },
      OperatorNoId
    >("/operators", operator);

    return data;
  }

  async updateOperator(
    id: string,
    newOperator: Partial<OperatorDto>
  ): Promise<void> {
    await httpClient.patch<
      any,
      unknown,
      { id: string; newOperator: Partial<OperatorDto> }
    >("/operators", { id, newOperator });
  }

  async deleteOperator(id: string): Promise<void> {
    await httpClient.delete<any, unknown, { id: string }>("/operators", {
      data: { id },
    });
  }
}
