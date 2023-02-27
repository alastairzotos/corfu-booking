import { paramCase } from 'change-case';
import { OperatorDto, ServiceDto, ServiceSchemaDto } from "dtos";

type UrlFn = (...args: any[]) => string;

interface Urls {
  [key: string]: UrlFn | Urls;
}

export const urls = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  admin: {
    home: () => '/admin',
    operators: () => '/admin/operators',
    operatorsCreate: () => '/admin/operators/create',
    operator: (id: string) => `/admin/operators/${id}`,
    operatorEdit: (id: string) => `/admin/operators/${id}/edit`,
    servicesCreate: (operatorId: string, schemaId: string) => `/admin/operators/${operatorId}/services/create?schemaId=${schemaId}`,
    service: (operatorId: string, id: string) => `/admin/operators/${operatorId}/services/${id}`,
    serviceSchemas: () => `/admin/service-schemas`,
    serviceSchema: (id: string) => `/admin/service-schemas/${id}`,
    serviceSchemaCreate: () => `/admin/service-schemas/create`,
    serviceSchemaCategories: () => '/admin/service-schema-categories',
    serviceSchemaCategory: (id: string) => `/admin/service-schema-categories/${id}`,
    serviceSchemaCategoryCreate: () => '/admin/service-schema-categories/create',
  },
  user: {
    operators: () => '/operators',
    operator: ({ _id, name }: OperatorDto) => `/operator/${paramCase(name)}-${_id}`,
    service: (service: ServiceDto) => `/service/${service._id}`,
    booking: (id: string) => `/booking/${id}`,
    services: () => '/services',
    serviceType: (schema: ServiceSchemaDto) => `/type/${paramCase(schema.pluralLabel)}-${schema._id}`,
  },
  operators: {
    home: () => '/operator-admin',
    booking: (id: string) => `/operator-admin/booking/${id}`
  }
} satisfies Urls;
