package com.example.leave_management_system.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "capabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Capability extends AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter(AccessLevel.PROTECTED)
    @Setter(AccessLevel.NONE)
    @ManyToMany(mappedBy = "capabilities", fetch = FetchType.LAZY)
    private Set<Role> roles = new HashSet<>();


    public Set<Role> getAllRoles() {
        return Set.copyOf(roles);
    }

    public void addRole(Role role) {
        roles.add(role);
        role.getCapabilities().add(this);
    }

    @Column(name = "name", unique = true, nullable = false, length = 100)
    private String name;

    public void removeRole(Role role) {
        roles.remove(role);
        role.getCapabilities().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Capability that)) return false;
        return Objects.equals(getName(), that.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getName());
    }
}
