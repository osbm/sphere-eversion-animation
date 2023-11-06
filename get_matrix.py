import numpy as np
import math

corrugation_start = 0.00
corrugation_end = 0.10
push_start = 0.10
push_end = 0.23
twist_start = 0.23
twist_end = 0.60
unpush_start = 0.60
unpush_end = 0.93
uncorrugation_start = 0.93
uncorrugation_end = 1.00

num_strips = 8
NumberOfLatitudinalPatchesPerHemisphere = 12 # min 2
NumberOfLongitudinalPatchesPerStrip = 12 # min 2

show_half_strips = False
u_min = 0.0
u_count = NumberOfLatitudinalPatchesPerHemisphere
u_max = 1.0

v_min = 0.0
v_count = NumberOfLongitudinalPatchesPerStrip
v_max = 0.5 if show_half_strips else 1.0

def FSInterp(u):
    pass

def Stage1(u, v):
    

def FFInterp(u):
    pass

def AddFigureEight():
    pass


def corrugation(u, v, time):
    tmp = [time, 0, 0]
    time = tmp[0]

    return AddFigureEight(
        Stage1(u, [0,0,1]),
        u, v, FFInterp(u) * ThreeJet(t,0,0), FSInterp(u),
        num_strips
    )

def push():
    pass

def twist():
    pass

def unpush():
    pass

def uncorrugation():
    pass


def calc_speedu(vector):
    return math.sqrt(
        (vector.x.u)**2 + (vector.y.u)**2 + (vector.z.u)**2
    )

def calc_speedv(vector):
    return math.sqrt(
        (vector.x.v)**2 + (vector.y.v)**2 + (vector.z.v)**2
    )


def apply(
    function,
    array_of_vertices: np.ndarray,
    time: float,
):
    delta_u = (u_max - u_min) / (u_count)
    delta_v = (v_max - v_min) / (v_count)

    values = np.zeros((u_count+1, v_count+1, 6))
    speedu = np.zeros((u_count+1, v_count+1, 6))
    speedv = np.zeros((u_count+1, 6))

    for j in range(u_count):
        u = umin + j*delta_u
        speedv[j] = calc_speedv(function([u,1,0], [0,0,1], time))

        if sppedv[j] == 0:
            u += 1e-9 if u < 1 else -1e-9
            speedv[j] = calc_speedv(function([u,1,0], [0,0,1], time))

        for k in range(v_count):
            v = vmin + k*delta_v
            values[j][k] = function([u,1,0], [v,0,1], time)
            speedu[j][k] = calc_speedu(values[j][k])

    for j in range(u_count):
        for k in range(v_count):
            print(values[j][k], array_of_vertices[j][k])

def get_matrix(time: float = 0.0):

    array_of_vertices = np.zeros((NumberOfLatitudinalPatchesPerHemisphere + 1, NumberOfLongitudinalPatchesPerStrip + 1, 6))
    # every point has 2 3 dimensional vectors one for position and one for normal

    if corrugation_start <= time <= corrugation_end:
        return corrugation(
            array_of_vertices,
            (time - corrugation_start) / (corrugation_end - corrugation_start),
        )

    elif push_start <= time <= push_end:
        return push(
            array_of_vertices,
            (time - push_start) / (push_end - push_start),
        )
    
    elif twist_start <= time <= twist_end:
        return twist(
            array_of_vertices,
            (time - twist_start) / (twist_end - twist_start),
        )

    elif unpush_start <= time <= unpush_end:
        return unpush(
            array_of_vertices,
            (time - unpush_start) / (unpush_end - unpush_start),
        )

    elif uncorrugation_start <= time <= uncorrugation_end:
        return uncorrugation(
            array_of_vertices,
            (time - uncorrugation_start) / (uncorrugation_end - uncorrugation_start),
        )
    else:
        raise ValueError("Time is out of range")