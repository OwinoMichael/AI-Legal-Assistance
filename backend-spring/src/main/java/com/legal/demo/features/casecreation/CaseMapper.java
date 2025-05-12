package com.legal.demo.features.casecreation;

import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CaseMapper {
    CaseResponseDTO toDto(Case entity);
    List<CaseResponseDTO> toDtoList(List<Case> entities);
}
