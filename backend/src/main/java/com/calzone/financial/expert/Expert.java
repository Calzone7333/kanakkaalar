package com.calzone.financial.expert;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "experts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String qualification;
    private String experience;
    private Double rating;
    private Integer reviews;
    
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> languages;
    
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> specialization;
    
    private String price;
    
    @Lob
    @Column(length = 1000000) // Ensure it's large enough
    private byte[] image;
    
    private String imageContentType;
    
    private boolean available;

    @Column(length = 1000)
    private String bio;
}
